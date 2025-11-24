
import ultralytics
from ultralytics import YOLO
import os, random, shutil
ultralytics.checks()
from is_animal import get_animals
from ruamel.yaml import YAML
import sys
import json

base_path = os.getcwd()
full_path = os.path.join(base_path, 'ML', 'animals')
animal_dirs = [d for d in os.listdir(full_path) if os.path.isdir(os.path.join(full_path, d))]


unwanted = ['fox', 'squirrel', 'horse', 'raccoon', 'wolf']
with open(os.path.join(base_path, 'ML', 'animals.json'), 'r') as f:
    animal_json = json.load(f)



#model = YOLO(os.path.join(base_path, 'runs', 'detect', 'train8', 'weights', 'best.pt'))
model = YOLO("yolov8s.pt")

def split_dataset(base_dir, animal, train_ratio=0.7, val_ratio=0.2, test_ratio=0.1):
    # Source images/labels are inside ../train relative to data.yaml
    img_dir = os.path.join(base_dir, "images")
    label_dir = os.path.join(base_dir, "labels")
    imgs = [f for f in os.listdir(img_dir) if f.endswith(".jpg") or f.endswith(".png")]
    random.shuffle(imgs)

    n = len(imgs)
    print(f"{animal}: {n} images")
    train_end = int(train_ratio * n)
    val_end = train_end + int(val_ratio * n)

    subsets = {
        "train": imgs[:train_end],
        "valid": imgs[train_end:val_end],
        "test": imgs[val_end:]
    }

    for subset, files in subsets.items():
        subset_img_dir   = os.path.join(base_path, "ML", subset, "images")
        subset_label_dir = os.path.join(base_path, "ML", subset, "labels")
        os.makedirs(subset_img_dir, exist_ok=True)
        os.makedirs(subset_label_dir, exist_ok=True)
        for f in files:
            img_name = f  # e.g. "horse-1_jpg.rf.b4e99fd911369a8cbae708877225dfe9.jpg"
            label_name = os.path.splitext(img_name)[0] + ".txt"

            # Add animal prefix to avoid collisions
            new_img_name   = f"{animal}_{img_name}"
            new_label_name = f"{animal}_{os.path.splitext(img_name)[0]}.txt"

            # Copy both
            shutil.copy(os.path.join(img_dir, img_name),
                        os.path.join(subset_img_dir, new_img_name))
            shutil.copy(os.path.join(label_dir, label_name),
                        os.path.join(subset_label_dir, new_label_name))



def save_yaml_clean(data, path):
    yaml = YAML()
    yaml.indent(mapping=2, sequence=4, offset=2)
    yaml.preserve_quotes = True

    with open(path, "w") as f:
        yaml.dump(data, f)

def edit_main_yaml():
    animals = get_animals()
    yaml = YAML()
    yaml_path = os.path.join(base_path, 'ML', 'data.yaml')
    with open(yaml_path, 'r') as f:
            data_yaml = yaml.load(f)

    data_yaml['nc'] = len(animals)
    data_yaml['names'] = [an for an in animal_json.keys()]


    save_yaml_clean(data_yaml, yaml_path)

def classify_labels(animal_dir, n):
    

     labels_path = os.path.join(full_path, animal_dir, 'labels')
     label_files = [f for f in os.listdir(labels_path) 
                          if os.path.isfile(os.path.join(labels_path, f))]
     for file in label_files:
          
          with open(os.path.join(labels_path, file), 'r') as f:
               content = f.read()

          with open(os.path.join(labels_path, file), 'w') as edit:
                new_lines = []
                for line in content.strip().splitlines():
                    parts = line.split()
                    parts[0] = str(n)
                    new_lines.append(" ".join(parts))
                edit.write("\n".join(new_lines))
            
               
     
############################# MAIN ###################################
if __name__ == "__main__":
    try:
        
        
        for animal in animal_dirs:
       #     if animal in unwanted:
          #       continue
           
            if animal_json.get(animal) is not None:
                
                animal_class_index = animal_json.get(animal)
            else : 
                 animal_class_index = list(animal_json.values())[-1] + 1
                 animal_json[animal] = animal_class_index
                 with open(os.path.join(base_path, 'ML', 'animals.json'), 'w') as f:
   
                     json.dump(animal_json, f)
            
            classify_labels(animal, animal_class_index)
            split_dataset(os.path.join(full_path, animal), animal)
            


        edit_main_yaml()

        data_yaml_path = os.path.join(base_path, 'ML', 'data.yaml' )
    
        model.train(
                data= data_yaml_path,  # dataset config (train/val paths, class names)
                epochs=50,                 # number of training epochs
                imgsz=640,                 # image size
                batch=48,
                workers=10,
                                     # batch size
            )
        model.val(data=data_yaml_path)
    except KeyboardInterrupt:
        sys.exit(0)

    