import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import { ApiGateway as TargetR53ApiGateway} from "aws-cdk-lib/aws-route53-targets";

interface ApiWithDomainProps{
    apiId : string;
    ARecordId : string;
    domain : string;
    wildcard: Certificate,
    hostedZone : HostedZone;
}

export class ApiWithDomain extends Construct {

    readonly api :  RestApi;

    constructor(scope: Construct, id: string, props: ApiWithDomainProps) {
        super(scope, id);

        
        this.api = new RestApi(this, props.apiId, {
            domainName: {
                domainName: props.domain,
                certificate: props.wildcard,
            } 
        });

        //Agregamos la api al dominio
        new ARecord(this, props.ARecordId, {
            zone: props.hostedZone,
            target: RecordTarget.fromAlias(new TargetR53ApiGateway(this.api))
        })
    };

}