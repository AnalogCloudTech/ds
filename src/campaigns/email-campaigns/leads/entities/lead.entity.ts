import { first, get } from 'lodash';
import { read as readExcel, utils as utilsExcel } from 'xlsx';
import { extension } from 'mime-types';
import { SchemaId } from '@/internal/types/helpers';
import * as Papa from 'papaparse';
import { Readable } from 'stream';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidationError,
  Validator,
} from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  Processors,
  Segments,
} from '@/campaigns/email-campaigns/leads/domain/types';
import { Type } from 'class-transformer';
import { detectEncodingAndCovertToString } from '@/campaigns/email-campaigns/leads/utils/files';

export class LeadEntity {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  segments: Segments;

  @IsNotEmpty()
  @IsBoolean()
  allSegments: boolean;

  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;

  @IsOptional()
  bookId: string;

  @IsNotEmpty()
  @IsBoolean()
  isValid: boolean;

  @IsNotEmpty()
  @IsBoolean()
  unsubscribed: boolean;

  @IsNotEmpty()
  customer: SchemaId;

  private validator: Validator;

  constructor(params = {}) {
    this.fill(params);
    this.validator = new Validator();
  }

  public fill(params: object): void {
    this.firstName = <string>get(params, 'firstName');
    this.lastName = <string>get(params, 'lastName');
    this.email = <string>get(params, 'email');
    this.phone = <string>get(params, 'phone');
    this.segments = <Array<number>>get(params, 'segments');
    this.bookId = <string>get(params, 'bookId');
    this.allSegments = get(params, 'allSegments') === 'true';
    this.isValid = <boolean>get(params, 'isValid', true);
    this.unsubscribed = <boolean>get(params, 'unsubscribed', false);
  }

  public async validate(): Promise<Array<ValidationError>> {
    return this.validator.validate(this);
  }

  public set(property: string, value: LeadEntity[keyof LeadEntity]): void {
    this[property] = value;
  }
}

export class LeadEntityList {
  private file: Express.Multer.File;
  public list: LeadEntity[] = [];

  public setFile(file: Express.Multer.File): void {
    this.file = file;
  }

  public push(lead: LeadEntity): void {
    this.list.push(lead);
  }

  public async readFile() {
    try {
      const ext = extension(this.file.mimetype);
      if (!ext) {
        throw new HttpException(
          'Invalid file extension',
          HttpStatus.BAD_REQUEST,
        );
      }

      const processor = <Processors>Processors[ext];
      return await this[processor](this.file.buffer);
    } catch (e) {
      throw new HttpException(
        'Error while processing file!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public setAll(property: string, value: LeadEntity[keyof LeadEntity]): void {
    this.list.forEach((lead: LeadEntity) => lead.set(property, value));
  }

  public async fillFromRawCsvFile(fileBuffer: Buffer) {
    return new Promise((resolve, reject) => {
      const readStream = Readable.from(
        detectEncodingAndCovertToString(fileBuffer),
      );
      const parsedData: string[][] = [];
      Papa.parse(readStream, {
        step: (result: { data: string[] }) => {
          parsedData.push(result.data);
        },
        complete: () => {
          this.processCsvData(parsedData);
          resolve(true);
        },
        error: () => {
          reject(new HttpException('Invalid CSV file', HttpStatus.BAD_REQUEST));
        },
      });
    });
  }

  public fillFromXLSFile(fileBuffer: Buffer) {
    const { Sheets, SheetNames } = readExcel(fileBuffer);
    const csvData = utilsExcel.sheet_to_csv(Sheets[first(SheetNames)]);
    const parsedData = Papa.parse<string[]>(csvData);
    this.processCsvData(parsedData.data);
    return true;
  }

  private processCsvData(payload: string[][]) {
    payload
      .filter((row, key) => key > 0 && row.length > 0)
      .forEach((row) => {
        const [firstName, lastName, email, phone] = row;
        this.list.push(new LeadEntity({ firstName, lastName, email, phone }));
      });
  }
}
