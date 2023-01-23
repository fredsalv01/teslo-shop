import { Module } from "@nestjs/common";
import { ProvidersService } from "./providers.service";
import { ProvidersController } from "./providers.controller";
import { AuthModule } from "src/auth/auth.module";
import { Provider } from "./entities/provider.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService],
  imports: [TypeOrmModule.forFeature([Provider]), AuthModule],
  exports: [ProvidersService, TypeOrmModule],
})
export class ProvidersModule {}
