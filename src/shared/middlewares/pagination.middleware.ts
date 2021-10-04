import { Injectable, NestMiddleware } from '@nestjs/common'

const DEFAULT_TAKE_VALUE = 10
const DEFAULT_SKIP_VALUE = 0

export interface IPager {
  take: number,
  skip: number
}

export class Pager implements IPager {
  take: number
  skip: number

  constructor(take?: number, skip?: number) {
      this.take = take || DEFAULT_TAKE_VALUE
      this.skip = skip || DEFAULT_SKIP_VALUE
  }
}

@Injectable()
export class PagerMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        req.query.take = +req.query.take || DEFAULT_TAKE_VALUE
        req.query.skip = +req.query.skip || DEFAULT_SKIP_VALUE
        next()
    }
}
