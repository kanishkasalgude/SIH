import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BackgroundWrapper } from './BackgroundWrapper';
import { Header } from './Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Store, Package, TrendingUp, History, LogOut, Plus, DollarSign } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

interface RetailerDashboardProps {
  onLogout: () => void;
}

export function RetailerDashboard({ onLogout }: RetailerDashboardProps) {
  const [sales, setSales] = useState([
    { 
      id: 1, 
      distributorBlockchainId: 'DIST001', 
      cropName: 'Rice', 
      weight: 500, 
      purchaseDate: '2024-01-20', 
      purchasePrice: 28, 
      sellingPrice: 35,
      retailerId: 'RET001',
      margin: 7
    },
    { 
      id: 2, 
      distributorBlockchainId: 'DIST002', 
      cropName: 'Wheat', 
      weight: 300, 
      purchaseDate: '2024-01-22', 
      purchasePrice: 32, 
      sellingPrice: 40,
      retailerId: 'RET002',
      margin: 8
    }
  ]);

  const [newSale, setNewSale] = useState({
    distributorBlockchainId: '',
    purchaseDate: '',
    sellingPrice: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const { t } = useLanguage();

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock distributor data lookup
    const mockDistributorData = {
      cropName: 'Tomato',
      weight: 200,
      purchasePrice: 25
    };

    const sale = {
      id: sales.length + 1,
      distributorBlockchainId: newSale.distributorBlockchainId,
      cropName: mockDistributorData.cropName,
      weight: mockDistributorData.weight,
      purchaseDate: newSale.purchaseDate,
      purchasePrice: mockDistributorData.purchasePrice,
      sellingPrice: parseInt(newSale.sellingPrice),
      retailerId: `RET${String(sales.length + 3).padStart(3, '0')}`,
      margin: parseInt(newSale.sellingPrice) - mockDistributorData.purchasePrice
    };

    setSales([...sales, sale]);
    setNewSale({ distributorBlockchainId: '', purchaseDate: '', sellingPrice: '' });
    setShowAddForm(false);
  };

  const marginData = sales.map(sale => ({
    name: sale.cropName,
    purchase: sale.purchasePrice,
    selling: sale.sellingPrice,
    margin: sale.margin
  }));

  const pieData = [
    { name: 'Profit', value: sales.reduce((sum, sale) => sum + (sale.margin * sale.weight), 0), color: '#138808' },
    { name: 'Cost', value: sales.reduce((sum, sale) => sum + (sale.purchasePrice * sale.weight), 0), color: '#ff6b35' }
  ];

  return (
    <BackgroundWrapper type="retailer">
      <Header />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('retailer')} {t('dashboard')}</h1>
              <p className="text-muted-foreground">Manage inventory and track sales performance</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="bg-card/80">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold text-foreground">{sales.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{sales.reduce((sum, sale) => sum + (sale.sellingPrice * sale.weight), 0).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Total Profit</p>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{sales.reduce((sum, sale) => sum + (sale.margin * sale.weight), 0).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-lime-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Avg Margin</p>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{Math.round(sales.reduce((sum, sale) => sum + sale.margin, 0) / sales.length || 0)}
                    </p>
                  </div>
                  <Store className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Add Sale Form */}
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
                  <form onSubmit={handleAddSale} className="space-y-4">
                    <div>
                      <Label htmlFor="distributorBlockchainId">Distributor Blockchain ID</Label>
                      <Input
                        id="distributorBlockchainId"
                        value={newSale.distributorBlockchainId}
                        onChange={(e) => setNewSale(prev => ({ ...prev, distributorBlockchainId: e.target.value }))}
                        placeholder="e.g., DIST001"
                        required
                        className="bg-input-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="purchaseDate">Date of Purchase</Label>
                      <Input
                        id="purchaseDate"
                        type="date"
                        value={newSale.purchaseDate}
                        onChange={(e) => setNewSale(prev => ({ ...prev, purchaseDate: e.target.value }))}
                        required
                        className="bg-input-background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sellingPrice">Final Selling Price (₹/kg)</Label>
                      <Input
                        id="sellingPrice"
                        type="number"
                        value={newSale.sellingPrice}
                        onChange={(e) => setNewSale(prev => ({ ...prev, sellingPrice: e.target.value }))}
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

            {/* Profit/Cost Distribution */}
            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        border: '1px solid var(--border)',
                        borderRadius: '6px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Margin Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Purchase vs Selling Price Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marginData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        border: '1px solid var(--border)',
                        borderRadius: '6px'
                      }} 
                    />
                    <Bar dataKey="purchase" fill="var(--primary)" name="Purchase Price" />
                    <Bar dataKey="selling" fill="var(--secondary)" name="Selling Price" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales History Table */}
            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Purchase</TableHead>
                      <TableHead>Selling</TableHead>
                      <TableHead>Margin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{sale.cropName}</TableCell>
                        <TableCell>₹{sale.purchasePrice}</TableCell>
                        <TableCell>₹{sale.sellingPrice}</TableCell>
                        <TableCell className="text-secondary">₹{sale.margin}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Complete Sales History */}
          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Complete Sales History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Retailer ID</TableHead>
                    <TableHead>Distributor ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Margin/kg</TableHead>
                    <TableHead>Total Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-mono text-primary">{sale.retailerId}</TableCell>
                      <TableCell className="font-mono text-secondary">{sale.distributorBlockchainId}</TableCell>
                      <TableCell>{sale.cropName}</TableCell>
                      <TableCell>{sale.weight}</TableCell>
                      <TableCell>{sale.purchaseDate}</TableCell>
                      <TableCell>₹{sale.purchasePrice}</TableCell>
                      <TableCell>₹{sale.sellingPrice}</TableCell>
                      <TableCell className="text-secondary">₹{sale.margin}</TableCell>
                      <TableCell className="text-secondary font-semibold">
                        ₹{(sale.margin * sale.weight).toLocaleString()}
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