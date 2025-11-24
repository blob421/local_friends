import zipfile
import os 

base = os.getcwd()
full_path = os.path.join(base, 'ML', 'animals')

zip_files = [file for file in os.listdir(full_path) if file.endswith('.zip')]

for file in zip_files:
    file_path = os.path.join(full_path, file)
    
    with zipfile.ZipFile(file_path, 'r') as f:
        f.extractall(os.path.join(full_path, os.path.splitext(file)[0].split('.')[0]))

## Extracts zips from a path and rename them bird instead of bird.bla.bla.zip