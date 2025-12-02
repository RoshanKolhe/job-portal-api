import { repository } from "@loopback/repository";
import { CurrencyExchangeRateRepository } from "../repositories";
import { HttpErrors } from "@loopback/rest";

export class CurrencyExchange {
  constructor(
    @repository(CurrencyExchangeRateRepository)
    private currencyExchangeRepository: CurrencyExchangeRateRepository
  ) {}

  // Helper: get the latest exchange rate row
  private async getLatestRate() {
    const exchangeRates = await this.currencyExchangeRepository.find({
      order: ["createdAt DESC"],
      where: { isActive: true, isDeleted: false },
    });

    const rate = exchangeRates[0];

    if (!rate) {
      throw new HttpErrors.NotFound("Exchange rate not found");
    }

    return rate;
  }

  // Convert ANY INPUT to INR
  async exchangeToINR(price: number): Promise<number> {
    if (!price && price !== 0) {
      throw new HttpErrors.BadRequest("Price is not valid");
    }

    const rate = await this.getLatestRate();

    // If admin defined USD → INR
    if (rate.baseCurrency === "USD" && rate.targetCurrency === "INR") {
      return price * rate.rate; // USD × rate = INR
    }

    // If admin defined INR → USD (rare)
    if (rate.baseCurrency === "INR" && rate.targetCurrency === "USD") {
      return price / rate.rate; // INR ÷ rate = USD
    }

    throw new HttpErrors.BadRequest("Invalid exchange rate configuration");
  }

  // Convert ANY INPUT to USD
  async exchangeToUSD(price: number): Promise<number> {
    if (!price && price !== 0) {
      throw new HttpErrors.BadRequest("Price is not valid");
    }

    const rate = await this.getLatestRate();

    // If admin defined USD → INR
    if (rate.baseCurrency === "USD" && rate.targetCurrency === "INR") {
      return price / rate.rate; // INR ÷ rate = USD
    }

    // If admin defined INR → USD
    if (rate.baseCurrency === "INR" && rate.targetCurrency === "USD") {
      return price * rate.rate; // INR × rate = USD
    }

    throw new HttpErrors.BadRequest("Invalid exchange rate configuration");
  }
}
