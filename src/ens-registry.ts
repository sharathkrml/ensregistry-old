import { BigInt, Bytes, ens } from "@graphprotocol/graph-ts"
import {
    Transfer as TransferEvent,
    NewOwner as NewOwnerEvent,
    NewResolver as NewResolverEvent,
    NewTTL as NewTTLEvent,
} from "../generated/ENSRegistry/ENSRegistry"
import { RegisterCall } from "../generated/SimpleRegistrar/SimpleRegistrar"
import {
    Counter,
    Transfer,
    NewOwner,
    NewResolver,
    NewTTL,
    Aggregation,
    Register,
} from "../generated/schema"

export function handleTransfer(event: TransferEvent): void {
    let counter = getCounter("Transfer")

    let transfer = new Transfer(counter.count.toString())
    transfer.index = counter.count
    transfer.hash = event.transaction.hash

    transfer.node = event.params.node

    transfer.owner = event.params.owner
    transfer.save()

    counter.save()
    let agg = getAggregation(event.transaction.hash)
    agg.blockNumber = event.block.number
    let transfers = agg.transfer
    if (transfers == null) {
        transfers = []
    }
    transfers.push(transfer.id)
    agg.transfer = transfers
    agg.save()
}

export function handleNewOwner(event: NewOwnerEvent): void {
    let counter = getCounter("NewOwner")

    let newOwner = new NewOwner(counter.count.toString())
    newOwner.index = counter.count
    newOwner.hash = event.transaction.hash

    let nodeName = ens.nameByHash(event.params.node.toHexString())
    if (nodeName == null) {
        nodeName = ""
    }
    newOwner.nodeName = nodeName!
    let labelName = ens.nameByHash(event.params.label.toHexString())
    if (labelName == null) {
        labelName = ""
    }
    newOwner.labelName = labelName!
    newOwner.node = event.params.node
    newOwner.owner = event.params.owner
    newOwner.label = event.params.label
    newOwner.save()

    counter.save()

    let agg = getAggregation(event.transaction.hash)
    agg.blockNumber = event.block.number
    let newOwners = agg.newOwner
    if (newOwners == null) {
        newOwners = []
    }
    newOwners.push(newOwner.id)
    agg.newOwner = newOwners
    agg.save()
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

    let agg = getAggregation(event.transaction.hash)
    agg.blockNumber = event.block.number
    let newResolvers = agg.newResolver
    if (newResolvers == null) {
        newResolvers = []
    }
    newResolvers.push(newResolver.id)
    agg.newResolver = newResolvers
    agg.save()
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

    let agg = getAggregation(event.transaction.hash)
    agg.blockNumber = event.block.number
    let newTTLs = agg.newTTL
    if (newTTLs == null) {
        newTTLs = []
    }
    newTTLs.push(newTTL.id)
    agg.newTTL = newTTLs
    agg.save()
}

export function handleRegister(call: RegisterCall): void {
    let counter = getCounter("RegisterCall")

    let entity = new Register(counter.count.toString())
    entity.index = counter.count
    entity.hash = call.transaction.hash

    entity.name = call.inputs.name
    entity.save()

    counter.save()

    let agg = getAggregation(call.transaction.hash)
    agg.blockNumber = call.block.number
    let registers = agg.register
    if (registers == null) {
        registers = []
    }
    registers.push(entity.id)
    agg.register = registers
    agg.save()
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

function getAggregation(hash: Bytes): Aggregation {
    let entity = Aggregation.load(hash.toHexString())
    if (!entity) {
        entity = new Aggregation(hash.toHexString())
    }
    return entity
}
