import { Controller, Get, Post, Body } from '@nestjs/common';
import { PriceService } from './price.service';

@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('last-24-hours')
  async getPrices() {
    // Logic to return prices from the last 24 hours
  }

  @Post('alert')
  async setAlert(
    @Body() alertDto: { chain: string; price: number; email: string },
  ) {
    // Logic to set alerts
  }

  @Get('swap-rate')
  async getSwapRate(@Body() { amount }: { amount: number }) {
    // Logic to get swap rate from ETH to BTC
  }
}
