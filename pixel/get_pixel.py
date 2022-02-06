import cv2 as cv
import numpy as np
import urllib.request


def getPixel(url):
    # read image
    # img = cv.imread(sys.argv[1], cv.IMREAD_COLOR)
    url_response = urllib.request.urlopen(url)
    img = cv.imdecode(
        np.array(bytearray(url_response.read()), dtype=np.uint8), -1)
    my_list = []

    # Using GaussianBlur
    blurred_frame = cv.GaussianBlur(img, (5, 5), 0)
    # BGR -> HSV
    hsv = cv.cvtColor(blurred_frame, cv.COLOR_BGR2HSV)
    # Green color Range
    # This is value for conditional setting for current environment

    # Set lower range [H, S, V]
    lower_green = np.array([30, 35, 50])
    # Set upper range
    upper_green = np.array([102, 255, 200])

    # Generate filter for within color range
    mask1 = cv.inRange(hsv, lower_green, upper_green)
    cts, _ = cv.findContours(mask1, cv.RETR_TREE, cv.CHAIN_APPROX_NONE)
    cv.drawContours(img, cts, -1, (0, 255, 0), 3)

    for c in cts:
        area1 = cv.contourArea(c)
        # 3000 픽셀 이하는 무시
        # 정식된 시기 인지해서 area 동적으로 바꿀 수 있게
        if area1 > 3000:
            cv.drawContours(blurred_frame, [c], -1, (255, 0, 0), 3)
            M = cv.moments(c)
            cx = int(M["m10"]/M["m00"])
            cy = int(M["m01"]/M["m00"])
            cv.putText(img, str(area1), (cx-20, cy-20),
                       cv.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

            my_list.append(area1)
    print(my_list)
    # res1 = cv.bitwise_and(img, img, mask=mask1)
    # 제일 큰 값이 식물의 픽셀 개수라는 전제
    my_list.sort(reverse=True)
    return my_list[0] if len(my_list) != 0 else -1
