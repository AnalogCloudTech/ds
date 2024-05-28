import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { DentistCoachDomain } from './domain/dentist-coach';
import { CreateDentistCoachDto } from './dto/create-dentist-coach.dto';
import { UpdateDentistCoachDto } from './dto/update-dentist-coach.dto';
import { EmailLowerCasePipe } from '@/internal/common/pipes/email-lower-case.pipe';
import {
  Paginator,
  PaginatorSchematicsInterface,
  PaginatorTransformPipe,
} from '@/internal/utils/paginator';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { DentistCoachesService } from '@/onboard/dentist-coaches/dentist-coaches.service';
import { DentistCoachDocument } from '@/onboard/dentist-coaches/schemas/dentist-coach.schema';

@Controller({ path: 'dentist-coaches', version: '1' })
export class DentistCoachesController {
  constructor(private readonly service: DentistCoachesService) {}

  @Serialize(DentistCoachDomain)
  @Get()
  async findAll(
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ): Promise<PaginatorSchematicsInterface<DentistCoachDocument>> {
    return this.service.findAllPaginated(page, perPage);
  }

  @Serialize(DentistCoachDomain)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DentistCoachDocument> {
    return this.service.findOne(id);
  }

  @Serialize(DentistCoachDomain)
  @UsePipes(ValidationTransformPipe)
  @Post('/')
  register(@Body(EmailLowerCasePipe) body: CreateDentistCoachDto) {
    return this.service.create(body);
  }

  @Serialize(DentistCoachDomain)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Serialize(DentistCoachDomain)
  @UsePipes(ValidationTransformPipe)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateDentistCoachDto) {
    return this.service.update(id, body);
  }
}
