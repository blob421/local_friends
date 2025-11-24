#folder = r'C:\Users\gabri\Desktop\Python\projects\local-friends\ML/animals/'.replace('\\', '/')
import os
import sys
base_path = os.getcwd()
full_path = os.path.join(base_path, 'ML', 'animals')

def get_animals():
    dirs = [dir.lower() for dir in os.listdir(full_path) 
                                        if os.path.isdir(os.path.join(full_path, dir))]
    return dirs

while True:
    try:
        name = input('Enter a name : ')
        animals = get_animals()
        if name.lower() in animals:
            print('Exists\n')
        else:
            print('\nNot there yet')

    except KeyboardInterrupt:
        print('\nExiting ...')
        sys.exit(0)

