// import { Injectable, OnApplicationShutdown } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopic, Kafka } from "kafkajs";

// @Injectable()
// export class ConsumerService implements OnApplicationShutdown {
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
//     private readonly consumers: Consumer[] = [];

//     async onApplicationShutdown(signal?: string) {
//         for (const consumer of this.consumers) {
//             await consumer.disconnect();
//         }
//     }

//     async consume(topic: ConsumerSubscribeTopic, config: ConsumerRunConfig) {
//         const consumer = this.kafka.consumer({ groupId: "nestjs-group-server" });
//         await consumer.connect();
//         await consumer.subscribe(topic);
//         await consumer.run(config);

//         this.consumers.push(consumer);
//     }
// }