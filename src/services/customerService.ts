import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CustomerService {
  constructor() {}

  async getCustomerById(id: number) {
    const customerById = await prisma.customer.findFirst({
      where: {
        id: id,
      },
    });
    console.log(customerById);
    return customerById;
  }
}
