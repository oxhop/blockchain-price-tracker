import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Repository } from 'typeorm';
import nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { Price } from './price.entity';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
  ) {}

  @Cron('0 */5 * * * *')
  async trackPrices() {
    const ethPrice = await this.getPrice('ethereum');
    const polygonPrice = await this.getPrice('polygon');

    const ethRecord = this.priceRepository.create({
      chain: 'ethereum',
      price: ethPrice,
      timestamp: new Date(),
    });
    const polygonRecord = this.priceRepository.create({
      chain: 'polygon',
      price: polygonPrice,
      timestamp: new Date(),
    });

    await this.priceRepository.save([ethRecord, polygonRecord]);

    // Check for alerts
    await this.checkPriceAlerts();
  }

  async getPrice(chain: string): Promise<number> {
    const response = await axios.get(`https://api.example.com/${chain}/price`);
    return response.data.price;
  }

  async checkPriceAlerts() {
    // Logic to check price changes and send emails
  }

  async sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to,
      subject,
      text,
    });
  }
}
