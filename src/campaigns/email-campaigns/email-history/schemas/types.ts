export enum LeadHistoryStatus {
  SEND = 'send',
  REJECTED = 'rejected',
  BOUNCE = 'bounce',
  COMPLAINT = 'complaint',
  DELIVERY = 'delivery',
  DELIVERY_DELAY = 'delivery_delay',
  OPEN = 'open',
  CLICK = 'click',
  RENDERINGFAILURE = 'rendering_failure',
  UNSUBSCRIBED = 'unsubscribed',
  DEFAULT = 'default',
  //custom type
  SOFT_BOUNCE = 'soft_bounce',
}

export enum RelationTypes {
  ON_DEMAND_EMAILS = 'OnDemandEmail',
  CAMPAIGNS = 'Campaign',
  CAMPAIGNS_HISTORY = 'CampaignHistory',
}
