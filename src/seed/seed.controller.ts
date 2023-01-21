import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger/dist";
import { SeedService } from "./seed.service";

@Controller("seed")
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiTags("seed")
  @Get()
  executeSeed() {
    return this.seedService.executeSeed();
  }
}
