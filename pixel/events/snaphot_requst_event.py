class ImageCreatedEvent:
    def __init__(self, object):
        self.imageUrl = object["imageUrl"]
        self.snapshotId = object["snapshotId"]
