import { useState } from 'react'
import { Ticket, Plus, Search, Filter, TrendingUp } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Label } from './components/ui/label'
import { Textarea } from './components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { toast } from 'react-hot-toast'

interface Coupon {
  id: string
  code: string
  title: string
  description: string
  discount: string
  type: 'percentage' | 'fixed'
  expiryDate: string
  isActive: boolean
  usageCount: number
  maxUsage: number
}

function App() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'WELCOME20',
      title: 'Welcome Bonus',
      description: 'Get 20% off your first WordPass subscription',
      discount: '20',
      type: 'percentage',
      expiryDate: '2024-12-31',
      isActive: true,
      usageCount: 45,
      maxUsage: 100
    },
    {
      id: '2',
      code: 'PREMIUM50',
      title: 'Premium Upgrade',
      description: '$50 off premium features for enterprise users',
      discount: '50',
      type: 'fixed',
      expiryDate: '2024-11-15',
      isActive: true,
      usageCount: 12,
      maxUsage: 50
    },
    {
      id: '3',
      code: 'SUMMER2024',
      title: 'Summer Special',
      description: 'Limited time summer promotion',
      discount: '15',
      type: 'percentage',
      expiryDate: '2024-08-31',
      isActive: false,
      usageCount: 200,
      maxUsage: 200
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [redeemCode, setRedeemCode] = useState('')

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    title: '',
    description: '',
    discount: '',
    type: 'percentage' as 'percentage' | 'fixed',
    expiryDate: '',
    maxUsage: ''
  })

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coupon.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && coupon.isActive) ||
                         (filterStatus === 'expired' && !coupon.isActive)
    return matchesSearch && matchesFilter
  })

  const handleAddCoupon = () => {
    if (!newCoupon.code || !newCoupon.title || !newCoupon.discount) {
      toast.error('Please fill in all required fields')
      return
    }

    const coupon: Coupon = {
      id: Date.now().toString(),
      code: newCoupon.code.toUpperCase(),
      title: newCoupon.title,
      description: newCoupon.description,
      discount: newCoupon.discount,
      type: newCoupon.type,
      expiryDate: newCoupon.expiryDate,
      isActive: new Date(newCoupon.expiryDate) > new Date(),
      usageCount: 0,
      maxUsage: parseInt(newCoupon.maxUsage) || 100
    }

    setCoupons([...coupons, coupon])
    setNewCoupon({
      code: '',
      title: '',
      description: '',
      discount: '',
      type: 'percentage',
      expiryDate: '',
      maxUsage: ''
    })
    setIsAddDialogOpen(false)
    toast.success('Coupon created successfully!')
  }

  const handleRedeemCoupon = () => {
    const coupon = coupons.find(c => c.code.toLowerCase() === redeemCode.toLowerCase())
    
    if (!coupon) {
      toast.error('Invalid coupon code')
      return
    }

    if (!coupon.isActive) {
      toast.error('This coupon has expired')
      return
    }

    if (coupon.usageCount >= coupon.maxUsage) {
      toast.error('This coupon has reached its usage limit')
      return
    }

    // Update usage count
    setCoupons(coupons.map(c => 
      c.id === coupon.id 
        ? { ...c, usageCount: c.usageCount + 1 }
        : c
    ))
    
    setRedeemCode('')
    toast.success(`Coupon redeemed! You saved ${coupon.type === 'percentage' ? coupon.discount + '%' : '$' + coupon.discount}`)
  }

  const totalCoupons = coupons.length
  const activeCoupons = coupons.filter(c => c.isActive).length
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.usageCount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Ticket className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">WordPass Coupons</h1>
                <p className="text-slate-600">Manage and redeem your discount codes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter coupon code"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value)}
                  className="w-48"
                />
                <Button onClick={handleRedeemCoupon} className="bg-green-600 hover:bg-green-700">
                  Redeem
                </Button>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Coupon
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Coupon</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="code">Coupon Code*</Label>
                      <Input
                        id="code"
                        placeholder="e.g., SAVE20"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Title*</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Holiday Special"
                        value={newCoupon.title}
                        onChange={(e) => setNewCoupon({...newCoupon, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe this coupon..."
                        value={newCoupon.description}
                        onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="discount">Discount*</Label>
                        <Input
                          id="discount"
                          placeholder="20"
                          value={newCoupon.discount}
                          onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select value={newCoupon.type} onValueChange={(value: 'percentage' | 'fixed') => setNewCoupon({...newCoupon, type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          type="date"
                          value={newCoupon.expiryDate}
                          onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxUsage">Max Usage</Label>
                        <Input
                          id="maxUsage"
                          placeholder="100"
                          value={newCoupon.maxUsage}
                          onChange={(e) => setNewCoupon({...newCoupon, maxUsage: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddCoupon} className="w-full">
                      Create Coupon
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Coupons</CardTitle>
              <Ticket className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalCoupons}</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Coupons</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{activeCoupons}</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Redemptions</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalRedemptions}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search coupons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'expired') => setFilterStatus(value)}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Coupons</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => (
            <Card key={coupon.id} className="bg-white shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="bg-slate-100 px-3 py-1 rounded-full">
                    <code className="text-sm font-mono font-bold text-slate-800">{coupon.code}</code>
                  </div>
                  <Badge variant={coupon.isActive ? "default" : "secondary"}>
                    {coupon.isActive ? "Active" : "Expired"}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{coupon.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 text-sm">{coupon.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">
                    {coupon.type === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`}
                    <span className="text-sm text-slate-500 font-normal"> OFF</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">
                      {coupon.usageCount}/{coupon.maxUsage} used
                    </div>
                    <div className="text-xs text-slate-400">
                      Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(coupon.usageCount / coupon.maxUsage) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No coupons found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App