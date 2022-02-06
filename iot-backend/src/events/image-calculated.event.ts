export class ImageCalculatedEvent {
    constructor(
        public readonly snapshotId: string,
        public readonly pixel: number,
    ) { }

    //object 넣으면 자동으로 stringfy 해주는데 인스턴스로 넣어주면, toString을 불러준다
    toString() {
        return JSON.stringify(this);
    }
}
