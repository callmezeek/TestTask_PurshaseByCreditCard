declare module "*.json" { 
  const value: any;
  export default value;
}

declare module "json!*" { 
  const value: any;
  export default value;
}

declare module 'react-number-format' {
  import * as React from 'react';
  export class NumberFormat extends React.Component<any, any> {
  }
  
  export default NumberFormat;
}