import { PrismaClient } from "@prisma/client";

const prismaClientSingleTon = () =>{
    return new PrismaClient();
}

declare const globalThis:{
    prismaGlobal: ReturnType<typeof prismaClientSingleTon>;
}& typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleTon();
export default prisma;
if(process.env.NODE_ENV!=='production')globalThis.prismaGlobal=prisma;