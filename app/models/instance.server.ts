import { z } from "zod";
import { prisma } from "~/db.server";
import type { DeviceInstance, Field, Event } from "@prisma/client";
import { Language } from "@prisma/client";

/*
 * Create
 */

export const InstanceInputSchema = z.object({
  deviceID: z.string().cuid(),
  authorID: z.string().cuid(),
  name: z.string(),
  addr: z.string(),
  language: z.nativeEnum(Language)
});

export type InstanceInput = z.infer<typeof InstanceInputSchema>;

export async function addInstance(instance: InstanceInput) {
  const { authorID, deviceID, name, addr, language } = InstanceInputSchema.parse(instance);
  return prisma.deviceInstance.create({
    data: {
      authorID,
      name,
      addr,
      language,
      deviceId: deviceID
    }
  });
}

/*
 * Read
 */

export const GetInstanceInputSchema = z.object({
  id: z.string().cuid()
});

export type GetInstanceInput = z.infer<typeof GetInstanceInputSchema>;

export type InstanceDetails =
  Pick<DeviceInstance, "id" | "name" | "addr" | "createdAt" | "updatedAt" | "deviceId" | "language">
  & {
  events: (Pick<Event, "id" | "name" | "description"> & {
    fields: Pick<Field, "name" | "type">[]
  })[]
}

export async function getInstance(inputs: GetInstanceInput): Promise<InstanceDetails> {
  const { id } = GetInstanceInputSchema.parse(inputs);
  return prisma.deviceInstance.findFirstOrThrow({
    where: { id },
    select: {
      id: true,
      addr: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      deviceId: true,
      language: true,
      device: {
        select: {
          nets: {
            select: {
              transitions: {
                select: {
                  events: {
                    select: {
                      id: true,
                      name: true,
                      description: true,
                      fields: {
                        select: {
                          name: true,
                          type: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }).then((instance) => {
    return {
      ...instance,
      events: instance.device.nets.flatMap(net => net.transitions.flatMap(transition => transition.events))
    };
  });
}

/*
 * List
 */

export const ListInstancesInputSchema = z.object({
  deviceID: z.string().cuid()
});

export type ListInstancesInput = z.infer<typeof ListInstancesInputSchema>;

export type InstanceListItem = Pick<DeviceInstance, "id" | "name" | "addr" | "language" | "updatedAt">

export async function listInstances(inputs: ListInstancesInput): Promise<InstanceListItem[]> {
  const { deviceID } = ListInstancesInputSchema.parse(inputs);
  return prisma.device.findFirst({
    where: { id: deviceID },
    select: {
      instances: {
        select: {
          id: true,
          name: true,
          addr: true,
          language: true,
          updatedAt: true
        }
      }
    }
  }).then((device) => {
    if (!device) {
      throw new Error("device not found");
    }
    return device.instances;
  });
}

/*
 * Update
 */

export const UpdateInstanceInputSchema = z.object({
  id: z.string().cuid(),
  name: z.string().optional(),
  addr: z.string().optional(),
  language: z.nativeEnum(Language).optional()
});

export type UpdateInstanceInput = z.infer<typeof UpdateInstanceInputSchema>;

export async function updateInstance(inputs: UpdateInstanceInput) {
  const { id, name, addr, language } = UpdateInstanceInputSchema.parse(inputs);
  return prisma.deviceInstance.update({
    where: { id },
    data: {
      name,
      addr,
      language
    }
  });
}

/*
 * Delete
 */

export const DeleteInstanceInputSchema = z.object({
  deviceID: z.string().cuid(),
  id: z.string().cuid()
});

export type DeleteInstanceInput = z.infer<typeof DeleteInstanceInputSchema>;

export async function deleteInstance(inputs: DeleteInstanceInput): Promise<void> {
  const { deviceID, id } = DeleteInstanceInputSchema.parse(inputs);
  return prisma.device.update({
    where: { id: deviceID },
    data: {
      instances: {
        delete: { id }
      }
    }
  }).then((device) => {
    if (!device) {
      throw new Error("device not found");
    }
  });
}