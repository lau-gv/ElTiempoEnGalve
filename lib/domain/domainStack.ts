import { Stack, StackProps } from "aws-cdk-lib";
import { Certificate, CertificateValidation, DnsValidatedCertificate } from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import { DOMAIN } from "./domainConstants";

export class DomainStack extends Stack {

    readonly hostedZone : HostedZone;
    readonly wildcardCertificate : Certificate;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.hostedZone = new HostedZone(this, 'HostedZone', {
            zoneName: DOMAIN
        });

        this.wildcardCertificate = new Certificate(this, "ElTiempoEnGalveCertificate", {
            domainName: DOMAIN,
            validation: CertificateValidation.fromDns(this.hostedZone)
        })
    }

}