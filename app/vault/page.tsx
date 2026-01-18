import { Container } from '@/components/layout/Container';
import { Card } from '@/components/shared/Card';
import { Upload, FileCheck, Clock, Shield } from 'lucide-react';

export default function VaultPage() {
  return (
    <Container>
      <div className="py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-heading-lg text-neutral-900 mb-2">Document Vault</h1>
          <p className="text-body text-neutral-600">
            Upload your documents once and reuse them across all benefit applications. Your files never leave your device.
          </p>
        </div>

        {/* Coming Soon Notice */}
        <Card className="p-8 text-center bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Upload className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-heading-md text-neutral-900 mb-2">Document Vault Coming Soon</h2>
          <p className="text-body text-neutral-600 max-w-xl mx-auto mb-6">
            The document vault feature is currently in development. Soon you'll be able to securely upload and manage all your benefit application documents in one place.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3">
                <FileCheck className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-body font-semibold text-neutral-900 mb-1">Upload Once</h3>
              <p className="text-body-sm text-neutral-600">
                Verify documents one time, use everywhere
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-body font-semibold text-neutral-900 mb-1">Save Time</h3>
              <p className="text-body-sm text-neutral-600">
                Auto-fill applications across programs
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3">
                <Shield className="w-6 h-6 text-secondary-500" />
              </div>
              <h3 className="text-body font-semibold text-neutral-900 mb-1">Secure</h3>
              <p className="text-body-sm text-neutral-600">
                Encrypted storage, complete privacy
              </p>
            </div>
          </div>
        </Card>

        {/* Placeholder for document types */}
        <div className="mt-8 space-y-4">
          <h3 className="text-heading-sm text-neutral-900">Documents You'll Be Able to Upload</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Birth Certificate',
              'Social Security Card',
              'Proof of Income',
              'Bank Statements',
              'Lease Agreement',
              'Medical Records',
              'Disability Determination Letter',
              'Government-Issued ID',
            ].map((docType) => (
              <Card key={docType} className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-neutral-500" />
                  </div>
                  <span className="text-body text-neutral-700">{docType}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
