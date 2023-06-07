import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CustomerService {
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
        phone: phone,
      },
    });
    return customer;
  }
}
