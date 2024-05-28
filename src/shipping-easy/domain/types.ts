export type Shipments = {
  id: number;
  tracking_number: string;
  carrier_key: string;
  ship_date: string;
  ship_from_address_id: number;
  shipment_type: string;
};

export type OriginalOrder = {
  custom_1: string;
};

export type Recipients = {
  original_order: OriginalOrder;
};

export type Orders = {
  id: number;
  alternate_order_id: string;
  external_order_identifier: string;
  ext_order_reference_id: string;
  store_api_key: string;
  shipments: Shipments[];
  prime_order_id: number;
  recipients: Recipients[];
};

export type MetaDescription = {
  total_pages: number;
  total_count: number;
};

export type SEResponse = {
  orders: Orders[];
  meta: MetaDescription;
};
