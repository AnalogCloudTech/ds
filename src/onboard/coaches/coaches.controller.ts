import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { CoachesService } from '@/onboard/coaches/coaches.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query, UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { CoachDomain } from './domain/coach';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { EmailLowerCasePipe } from '@/internal/common/pipes/email-lower-case.pipe';
import {
  Paginator,
  PaginatorSchematicsInterface,
  PaginatorTransformPipe,
} from '@/internal/utils/paginator';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';

@Controller({ path: 'coaches', version: '1' })
export class CoachesController {
  constructor(private readonly service: CoachesService) {}

  @Serialize(CoachDomain)
  @Get()
  async findAll(
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ): Promise<PaginatorSchematicsInterface<CoachDocument>> {
    return this.service.findAllPaginated(page, perPage);
  }

  @Serialize(CoachDomain)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CoachDocument> {
    return this.service.findOne(id);
  }

  @Serialize(CoachDomain)
  @UsePipes(ValidationTransformPipe)
  @Post('/')
  register(@Body(EmailLowerCasePipe) body: CreateCoachDto) {
    return this.service.create(body);
  }

  @Serialize(CoachDomain)
  @Delete(':id')
  remove(@Param('id') id: string) {
    throw new UnauthorizedException({
      message: 'You are not allowed to delete a coach',
    });
  }

  @Serialize(CoachDomain)
  @UsePipes(ValidationTransformPipe)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateCoachDto) {
    return this.service.update(id, body);
  }
}
