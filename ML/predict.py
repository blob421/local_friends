
from ultralytics import YOLO
import os
base_path = os.getcwd()

model = YOLO(os.path.join(base_path, 'runs', 'detect', 'train30', 'weights', 'best.pt'))

model.predict(os.path.join(base_path, 'test_img', 'por2.jpg'))
