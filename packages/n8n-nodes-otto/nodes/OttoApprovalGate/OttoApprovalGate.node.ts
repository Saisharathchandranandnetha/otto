import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

export class OttoApprovalGate implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Otto Approval Gate',
    name: 'ottoApprovalGate',
    icon: 'fa:shield-alt',
    group: ['transform'],
    version: 1,
    description: 'Suspends the workflow until the OTTO Trust Engine approves the action',
    defaults: {
      name: 'Otto Approval Gate',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Action Class',
        name: 'actionClass',
        type: 'options',
        options: [
          { name: 'Read', value: 'read' },
          { name: 'Internal Write', value: 'internal_write' },
          { name: 'External Read', value: 'external_read' },
          { name: 'External Write', value: 'external_write' },
          { name: 'Communication', value: 'communication' },
          { name: 'Financial Small', value: 'financial_small' },
          { name: 'Financial Large', value: 'financial_large' },
        ],
        default: 'read',
        required: true,
        description: 'The Trust Engine Action Class to evaluate against',
      },
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        default: 0,
        description: 'Optional amount for financial transactions',
      }
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    
    for (let i = 0; i < items.length; i++) {
      try {
        const actionClass = this.getNodeParameter('actionClass', i) as string;
        const amount = this.getNodeParameter('amount', i) as number;
        
        // This is a stub for the community node execution.
        // In production, this would make an HTTP request to the OTTO API to check the trust grant
        // or trigger a webhook that resumes this node upon approval.
        
        const response = {
          success: true,
          actionClass,
          amount,
          status: 'awaiting_approval' // Simulated suspension
        };

        returnData.push({ json: response });
      } catch (error: any) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message } });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
      }
    }

    return [returnData];
  }
}
