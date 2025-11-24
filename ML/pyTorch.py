
import ultralytics
from ultralytics import YOLO
import os, random, shutil
ultralytics.checks()

base_path = os.getcwd()
full_path = os.path.join(base_path, 'ML', 'animals')
animal_dirs = [d for d in os.listdir(full_path) if os.path.isdir(os.path.join(full_path, d))]

model = YOLO("yolov8s.pt")


def split_dataset(base_dir, train_ratio=0.7, val_ratio=0.2, test_ratio=0.1):
    # Source images/labels are inside ../train relative to data.yaml
    img_dir = os.path.join(base_dir, "train/images")
    label_dir = os.path.join(base_dir, "train/labels")
    imgs = [f for f in os.listdir(img_dir) if f.endswith(".jpg") or f.endswith(".png")]
    random.shuffle(imgs)

    n = len(imgs)
    train_end = int(train_ratio * n)
    val_end = train_end + int(val_ratio * n)

    subsets = {
        "train": imgs[:train_end],
        "valid": imgs[train_end:val_end],
        "test": imgs[val_end:]
    }

    for subset, files in subsets.items():
        subset_img_dir = os.path.join(base_dir, f"../{subset}/images")
        subset_label_dir = os.path.join(base_dir, f"../{subset}/labels")
        os.makedirs(subset_img_dir, exist_ok=True)
        os.makedirs(subset_label_dir, exist_ok=True)
        for f in files:
            shutil.copy(os.path.join(img_dir, f), os.path.join(subset_img_dir, f))
            label_file = f.rsplit(".", 1)[0] + ".txt"
            shutil.copy(os.path.join(label_dir, label_file), os.path.join(subset_label_dir, label_file))



for animal in animal_dirs:
    split_dataset(os.path.join(full_path, animal))
    data_yaml_path = os.path.join(full_path, animal, 'data.yaml' )
    model.train(
        data= data_yaml_path,  # dataset config (train/val paths, class names)
        epochs=50,                 # number of training epochs
        imgsz=640,                 # image size
        batch=16                   # batch size
    )
