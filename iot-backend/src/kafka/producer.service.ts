// import { Injectable, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { Kafka, Producer, ProducerRecord } from "kafkajs";

// @Injectable()
// export class ProducerService implements OnModuleInit, OnApplicationShutdown {
//     constructor(private configService: ConfigService) { }
//     private readonly kafka = new Kafka({
//         brokers: [this.configService.get('KAFKA_BROKER')],
//         ssl: true,
//         sasl: {
//             mechanism: 'plain',
//             username: this.configService.get('KAFKA_API_KEY'),
//             password: this.configService.get('KAFKA_API_SECRET'),
//         },

//     });
//     private readonly producer: Producer = this.kafka.producer();

//     async onModuleInit() {
//         await this.producer.connect();
//     }

//     async onApplicationShutdown() {
//         this.producer.disconnect();
//     }

//     async produce(record: ProducerRecord) {
//         await this.producer.send(record);
//     }

// }