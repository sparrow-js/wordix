import prisma from "@/backend/prisma";

import {
  type CustomerCreatedEvent,
  type CustomerUpdatedEvent,
  type EventEntity,
  EventName,
  type SubscriptionCreatedEvent,
  type SubscriptionUpdatedEvent,
} from "@paddle/paddle-node-sdk";

import { chargeToken } from "@/lib/charge-token";

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
        await this.updateSubscriptionData(eventData);
        break;
      case EventName.CustomerCreated:
      case EventName.CustomerUpdated:
        await this.updateCustomerData(eventData);
        break;
    }
  }

  private async updateSubscriptionData(eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent) {
    try {
      const response = await prisma.subscription.upsert({
        where: {
          subscription_id: eventData.data.id,
        },
        create: {
          subscription_id: eventData.data.id,
          subscription_status: eventData.data.status,
          price_id: eventData.data.items[0].price?.id ?? "",
          product_id: eventData.data.items[0].price?.productId ?? "",
          scheduled_change: eventData.data.scheduledChange?.effectiveAt ?? "",
          customer_id: eventData.data.customerId,
        },
        update: {
          subscription_status: eventData.data.status,
          price_id: eventData.data.items[0].price?.id ?? "",
          product_id: eventData.data.items[0].price?.productId ?? "",
          scheduled_change: eventData.data.scheduledChange?.effectiveAt ?? "",
          customer_id: eventData.data.customerId,
        },
      });

      if (eventData.eventType === EventName.SubscriptionCreated) {
        const customer = await prisma.customer.findUnique({
          where: {
            customer_id: eventData.data.customerId,
          },
        });

        if (customer) {
          await chargeToken(customer.email, 10, "vip");
        }
      }
      return response;
    } catch (e) {
      console.error(e);
    }
  }

  private async updateCustomerData(eventData: CustomerCreatedEvent | CustomerUpdatedEvent) {
    try {
      const response = await prisma.customer.upsert({
        where: {
          customer_id: eventData.data.id,
        },
        create: {
          customer_id: eventData.data.id,
          email: eventData.data.email,
          user_id: "",
        },
        update: {
          email: eventData.data.email,
        },
      });
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }
}
