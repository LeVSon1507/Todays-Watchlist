
import { Request } from 'express';

const PAGE_SIZE = 100;

function getPagingParams(req: Request): { currentPage: number, offset: number, limit: number } {
   const currentPage = parseInt(req.query.page as string) || 1;
   const offset = (currentPage - 1) * PAGE_SIZE;
   const limit = PAGE_SIZE;
   return { currentPage, offset, limit };
}

function getTotalPages(totalItems: number): number {
   return Math.ceil(totalItems / PAGE_SIZE);
}

export { getPagingParams, getTotalPages };
