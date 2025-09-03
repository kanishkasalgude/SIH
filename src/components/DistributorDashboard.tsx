import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BackgroundWrapper } from './BackgroundWrapper';
import { Header } from './Header';
import { Timeline } from './ui/Timeline';
import { Truck, Package, TrendingUp, History, LogOut, Plus } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

interface DistributorDashboardProps {
  onLogout: () => void;
}

export function DistributorDashboard({ onLogout }: DistributorDashboardProps) {
  const [purchases, setPurchases] = useState([
    { 
      id: 1, 
      farmerBlockchainId: 'BC001', 
      cropName: 'Rice', 
      weight: 500, 
      purchaseDate: '2024-01-16', 
      buyingPrice: 25, 
      otherCharges: 500, 
      distributorId: 'DIST001',
      status: 'In Transit'
    },
    { 
      id: 2, 
      farmerBlockchainId: 'BC002', 
      cropName: 'Wheat', 
      weight: 300, 
      purchaseDate: '2024-01-21', 
      buyingPrice: 30, 
      otherCharges: 300, 
      distributorId: 'DIST002',
      status: 'Delivered'
    }
  ]);

  const [newPurchase, setNewPurchase] = useState({
    farmerBlockchainId: '',
    purchaseDate: '',
    buyingPrice: '',
    otherCharges: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const { t } = useLanguage();

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock crop data lookup based on farmer blockchain ID
    const mockCrop = {
      cropName: 'Tomato',
      weight: 200
    };

    const purchase = {
      id: purchases.length + 1,
      farmerBlockchainId: newPurchase.farmerBlockchainId,
      cropName: mockCrop.cropName,
      weight: mockCrop.weight,
      purchaseDate: newPurchase.purchaseDate,
      buyingPrice: parseInt(newPurchase.buyingPrice),
      otherCharges: parseInt(newPurchase.otherCharges),
      distributorId: `DIST${String(purchases.length + 3).padStart(3, '0')}`,
      status: 'Processing'
    };

    setPurchases([...purchases, purchase]);
    setNewPurchase({ farmerBlockchainId: '', purchaseDate: '', buyingPrice: '', otherCharges: '' });
    setShowAddForm(false);
  };

  const timelineData = [
    { title: 'Purchase from Farmer', date: '2024-01-16', status: 'completed', description: 'Bought 500kg Rice from BC001' },
    { title: 'Quality Check', date: '2024-01-17', status: 'completed', description: 'Quality inspection passed' },
    { title: 'Storage in Warehouse', date: '2024-01-18', status: 'completed', description: 'Stored in Warehouse Section A' },
    { title: 'Packaging', date: '2024-01-19', status: 'in-progress', description: 'Packaging in progress' },
    { title: 'Ready for Retail', date: '2024-01-20', status: 'pending', description: 'Ready for retailer pickup' }
  ];

  return (
    <BackgroundWrapper type="distributor">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('distributor')} {t('dashboard')}</h1>
              <p className="text-muted-foreground">Manage supply chain logistics and track shipments</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="bg-card/80">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Total Purchases</p>
                    <p className="text-2xl font-bold text-foreground">{purchases.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Total Weight Handled</p>
                    <p className="text-2xl font-bold text-foreground">
                      {purchases.reduce((sum, purchase) => sum + purchase.weight, 0)} kg
                    </p>
                  </div>
                  <Truck className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Total Investment</p>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{purchases.reduce((sum, purchase) => sum + (purchase.weight * purchase.buyingPrice + purchase.otherCharges), 0).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-lime-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Add Purchase Form */}
            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Record New Purchase</CardTitle>
                  <Button
                    onClick={() => setShowAddForm(!showAddForm)}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Purchase
                  </Button>
                </div>
              </CardHeader>
              {showAddForm && (
                <CardContent>
                  <form onSubmit={handleAddPurchase} className="space-y-4">
                    <div>
                      <Label htmlFor="farmerBlockchainId">Farmer Blockchain ID</Label>
                      <Input
                        id="farmerBlockchainId"
                        value={newPurchase.farmerBlockchainId}
                        onChange={(e) => setNewPurchase(prev => ({ ...prev, farmerBlockchainId: e.target.value }))}
                        placeholder="e.g., BC001"
                        required
                        className="bg-input-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="purchaseDate">Date of Purchase</Label>
                      <Input
                        id="purchaseDate"
                        type="date"
                        value={newPurchase.purchaseDate}
                        onChange={(e) => setNewPurchase(prev => ({ ...prev, purchaseDate: e.target.value }))}
                        required
                        className="bg-input-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="buyingPrice">Buying Price (₹/kg)</Label>
                      <Input
                        id="buyingPrice"
                        type="number"
                        value={newPurchase.buyingPrice}
                        onChange={(e) => setNewPurchase(prev => ({ ...prev, buyingPrice: e.target.value }))}
                        required
                        className="bg-input-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="otherCharges">Other Charges (₹)</Label>
                      <Input
                        id="otherCharges"
                        type="number"
                        value={newPurchase.otherCharges}
                        onChange={(e) => setNewPurchase(prev => ({ ...prev, otherCharges: e.target.value }))}
                        required
                        className="bg-input-background"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Record Purchase
                    </Button>
                  </form>
                </CardContent>
              )}
            </Card>

            {/* Supply Chain Timeline */}
            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Supply Chain Timeline</CardTitle>
                <p className="text-sm text-muted-foreground">Latest shipment: DIST001</p>
              </CardHeader>
              <CardContent>
                <Timeline data={timelineData} />
              </CardContent>
            </Card>
          </div>

          {/* Purchase History */}
          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Purchase History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Distributor ID</TableHead>
                    <TableHead>Farmer ID</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Price (₹/kg)</TableHead>
                    <TableHead>Other Charges</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-mono text-primary">{purchase.distributorId}</TableCell>
                      <TableCell className="font-mono text-secondary">{purchase.farmerBlockchainId}</TableCell>
                      <TableCell>{purchase.cropName}</TableCell>
                      <TableCell>{purchase.weight}</TableCell>
                      <TableCell>{purchase.purchaseDate}</TableCell>
                      <TableCell>₹{purchase.buyingPrice}</TableCell>
                      <TableCell>₹{purchase.otherCharges}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          purchase.status === 'Delivered' 
                            ? 'bg-secondary/20 text-secondary' 
                            : purchase.status === 'In Transit'
                            ? 'bg-yellow-500/20 text-yellow-600'
                            : 'bg-primary/20 text-primary'
                        }`}>
                          {purchase.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </BackgroundWrapper>
  );
}