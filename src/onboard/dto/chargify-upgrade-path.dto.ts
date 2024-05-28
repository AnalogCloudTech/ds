export class ChargifyUpgradePathDto {
  bookId: string;
}

export class ChargifyUpgradePathResponseDto {
  plans: ChargifyUpgradePathLineItem[];
}

export class ChargifyUpgradePathLineItem {
  componentId: number;
  componentName: string;
  productHandle: string;
}
