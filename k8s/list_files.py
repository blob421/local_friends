import os 
cmd_dir = os.getcwd()
for root, dirs, files in os.walk(cmd_dir): 
    for name in files: print(os.path.join(root, name))