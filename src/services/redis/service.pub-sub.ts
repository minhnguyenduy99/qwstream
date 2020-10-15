import { Inject, Injectable } from "@nestjs/common";
import { Observable, Observer } from "rxjs";
import { REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT } from "./config";
import { RedisClient } from "./module";
import { filter, map } from "rxjs/operators";



@Injectable()
export class RedisPubSubService {

    constructor(
        @Inject(REDIS_PUBLISHER_CLIENT) private readonly publisher: RedisClient,
        @Inject(REDIS_SUBSCRIBER_CLIENT) private readonly subcriber: RedisClient,
    ) {}

    fromEvent<T>(eventName: string): Observable<T> {
        this.subcriber.subscribe(eventName);
        return new Observable((observer: Observer<any>) => 
            this.subcriber.on("message", (channel, message) => observer.next({ channel, message }))
        ).pipe(
            filter(({ channel }) => channel === eventName),
            map(({ message }) => JSON.parse(message))
        )
    }

    async publish(channel: string, value: unknown) {
        const number = await this.publisher.publish(channel, JSON.stringify(value));
        return number;
    }
}