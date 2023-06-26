import { BigInt } from "@graphprotocol/graph-ts"
import {
    Transfer as TransferEvent,
    NewOwner as NewOwnerEvent,
    NewResolver as NewResolverEvent,
    NewTTL as NewTTLEvent,
} from "../generated/ENSRegistry/ENSRegistry"
import { Counter, Transfer, NewOwner, NewResolver, NewTTL } from "../generated/schema"

export function handleTransfer(event: TransferEvent): void {
    let counter = getCounter("Transfer")

    let transfer = new Transfer(counter.count.toString())
    transfer.index = counter.count
    transfer.hash = event.transaction.hash

    transfer.node = event.params.node
    transfer.owner = event.params.owner
    transfer.save()

    counter.save()
}

export function handleNewOwner(event: NewOwnerEvent): void {
    let counter = getCounter("NewOwner")

    let newOwner = new NewOwner(counter.count.toString())
    newOwner.index = counter.count
    newOwner.hash = event.transaction.hash

    newOwner.node = event.params.node
    newOwner.owner = event.params.owner
    newOwner.label = event.params.label
    newOwner.save()

    counter.save()
}

export function handleNewResolver(event: NewResolverEvent): void {
    let counter = getCounter("NewResolver")

    let newResolver = new NewResolver(counter.count.toString())
    newResolver.index = counter.count
    newResolver.hash = event.transaction.hash

    newResolver.node = event.params.node
    newResolver.resolver = event.params.resolver
    newResolver.save()

    counter.save()
}

export function handleNewTTL(event: NewTTLEvent): void {
    let counter = getCounter("NewTTL")

    let newTTL = new NewTTL(counter.count.toString())
    newTTL.index = counter.count
    newTTL.hash = event.transaction.hash

    newTTL.node = event.params.node
    newTTL.ttl = event.params.ttl
    newTTL.save()

    counter.save()
}

function getCounter(key: string): Counter {
    let counter = Counter.load(key)
    if (!counter) {
        counter = new Counter(key)
        counter.count = BigInt.fromI32(0)
    }
    counter.count = counter.count.plus(BigInt.fromI32(1))
    return counter
}
