import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { BackgroundWrapper } from './BackgroundWrapper';
import { Header } from './Header';
import { Timeline } from './ui/Timeline';
import { QrCode, Upload, Camera, ArrowLeft, CheckCircle, Package, User, Truck, Store } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

interface CustomerQRScannerProps {
  onBack: () => void;
}

export function CustomerQRScanner({ onBack }: CustomerQRScannerProps) {
  const [scannedData, setScannedData] = useState<any>(null);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Mock blockchain data for demonstration
  const mockBlockchainData = {
    'QR001': {
      productName: 'Organic Rice',
      currentLocation: 'Fresh Mart Store, Delhi',
      status: 'Ready for Sale',
      trail: [
        {
          stage: 'Farmer',
          name: 'Raj Kumar',
          location: 'Village Rampur, Uttar Pradesh',
          date: '2024-01-15',
          blockchainId: 'BC001',
          details: {
            cropName: 'Rice',
            weight: '500 kg',
            harvestDate: '2024-01-15',
            expectedPrice: '₹25/kg'
          }
        },
        {
          stage: 'Distributor',
          name: 'AgriFlow Logistics',
          location: 'Warehouse Delhi',
          date: '2024-01-18',
          blockchainId: 'DIST001',
          details: {
            purchasePrice: '₹28/kg',
            qualityCheck: 'Passed',
            storageCondition: 'Temperature Controlled'
          }
        },
        {
          stage: 'Retailer',
          name: 'Fresh Mart',
          location: 'Connaught Place, Delhi',
          date: '2024-01-22',
          blockchainId: 'RET001',
          details: {
            finalPrice: '₹35/kg',
            expiryDate: '2024-06-15',
            certification: 'Organic Certified'
          }
        }
      ]
    },
    'QR002': {
      productName: 'Fresh Wheat',
      currentLocation: 'Super Bazaar, Mumbai',
      status: 'Ready for Sale',
      trail: [
        {
          stage: 'Farmer',
          name: 'Priya Sharma',
          location: 'Village Khetri, Rajasthan',
          date: '2024-01-20',
          blockchainId: 'BC002',
          details: {
            cropName: 'Wheat',
            weight: '300 kg',
            harvestDate: '2024-01-20',
            expectedPrice: '₹30/kg'
          }
        },
        {
          stage: 'Distributor',
          name: 'GrainFlow Solutions',
          location: 'Warehouse Mumbai',
          date: '2024-01-23',
          blockchainId: 'DIST002',
          details: {
            purchasePrice: '₹32/kg',
            qualityCheck: 'Grade A',
            processingDate: '2024-01-24'
          }
        },
        {
          stage: 'Retailer',
          name: 'Super Bazaar',
          location: 'Bandra, Mumbai',
          date: '2024-01-26',
          blockchainId: 'RET002',
          details: {
            finalPrice: '₹40/kg',
            expiryDate: '2024-07-20',
            packagingDate: '2024-01-25'
          }
        }
      ]
    }
  };

  const handleManualScan = () => {
    if (manualCode) {
      const data = mockBlockchainData[manualCode as keyof typeof mockBlockchainData];
      if (data) {
        setScannedData(data);
      } else {
        alert('QR Code not found in blockchain. Please check the code and try again.');
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock QR code reading from image
      setScannedData(mockBlockchainData.QR001);
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'Farmer': return User;
      case 'Distributor': return Truck;
      case 'Retailer': return Store;
      default: return Package;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Farmer': return 'text-green-600';
      case 'Distributor': return 'text-emerald-600';
      case 'Retailer': return 'text-lime-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStageBackground = (stage: string) => {
    switch (stage) {
      case 'Farmer': return 'bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800';
      case 'Distributor': return 'bg-emerald-100 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-800';
      case 'Retailer': return 'bg-lime-100 dark:bg-lime-900 border-lime-200 dark:border-lime-800';
      default: return 'bg-card border-border';
    }
  };

  if (scannedData) {
    return (
      <BackgroundWrapper type="customer">
        <Header />
        
        <div className="pt-20 px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setScannedData(null)}
              className="mb-4 text-foreground hover:bg-card/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Scan Another QR
            </Button>

            {/* Product Summary */}
            <Card className="bg-card/90 backdrop-blur-sm border-border/50 mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-foreground">{scannedData.productName}</CardTitle>
                    <p className="text-muted-foreground">{scannedData.currentLocation}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{scannedData.status}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Supply Chain Timeline */}
            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  Complete Supply Chain Trail
                </CardTitle>
                <p className="text-muted-foreground">Track the journey from farm to your table</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {scannedData.trail.map((step: any, index: number) => {
                    const StageIcon = getStageIcon(step.stage);
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStageBackground(step.stage)} ${getStageColor(step.stage)}`}>
                            <StageIcon className="w-6 h-6" />
                          </div>
                          {index < scannedData.trail.length - 1 && (
                            <div className="w-0.5 h-16 bg-gradient-to-b from-green-300 to-emerald-300 mt-2" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="bg-card/60 rounded-lg p-4 border border-border/50">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-foreground">{step.stage}</h3>
                                <p className="text-sm font-medium text-muted-foreground">{step.name}</p>
                                <p className="text-xs text-muted-foreground">{step.location}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">{step.date}</p>
                                <p className="text-xs font-mono text-primary">{step.blockchainId}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                              {Object.entries(step.details).map(([key, value]) => (
                                <div key={key} className="bg-muted/50 rounded px-3 py-2">
                                  <p className="text-xs text-muted-foreground capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </p>
                                  <p className="text-sm font-medium text-foreground">{value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Verification Footer */}
                <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Blockchain Verified</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This product's authenticity and supply chain trail has been verified on the blockchain. 
                    All information is tamper-proof and transparent.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper type="customer">
      <Header />
      
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-foreground hover:bg-card/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <QrCode className="w-6 h-6 text-green-600" />
                {t('scanQR')}
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Scan or upload QR code to trace product journey
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Camera Scan Button */}
              <Button
                onClick={() => setIsScanning(!isScanning)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white"
                disabled
              >
                <Camera className="w-4 h-4 mr-2" />
                Open Camera Scanner
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Camera access not available in this demo
              </p>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              {/* Upload QR Image */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full bg-card/80 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950/20"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload QR Code Image
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              {/* Manual QR Code Entry */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Enter QR Code Manually</label>
                  <Input
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="e.g., QR001"
                    className="bg-input-background"
                  />
                </div>
              <Button
                  onClick={handleManualScan}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
                  disabled={!manualCode}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Trace Product
                </Button>
              </div>

              {/* Demo Codes */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="text-sm font-medium text-foreground mb-2">Demo QR Codes:</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setManualCode('QR001')}
                    className="block text-xs text-green-600 hover:underline"
                  >
                    QR001 - Organic Rice 🌾
                  </button>
                  <button
                    onClick={() => setManualCode('QR002')}
                    className="block text-xs text-emerald-600 hover:underline"
                  >
                    QR002 - Fresh Wheat 🌾
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BackgroundWrapper>
  );
}