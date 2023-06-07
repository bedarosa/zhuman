import { PrismaClient } from "@prisma/client";
import { ICustomerDatabase } from "../interfaces/ICustomerDatabase";

const prisma = new PrismaClient();

export class CustomerService implements ICustomerDatabase {
  constructor() {}

  async getCustomerById(id: number) {
    const customer = await prisma.customer.findFirst({
      where: {
        id: id,
      },
    });
    console.log(customer);
    return customer;
  }

  async getCustomerByPhone(phone: string) {
    const customer = await prisma.customer.findFirst({
      where: {
        phone: {
          contains: phone,
        },
      },
    });
    return customer;
  }
}
