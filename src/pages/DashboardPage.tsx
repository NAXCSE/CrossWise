import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Package, Globe, Calculator, FileText, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { products, orders, documents, getAnalytics } = useStore();
  const analytics = getAnalytics();

  const statCards = [
    {
      title: 'Total Products',
      value: analytics.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Countries Served',
      value: analytics.countriesServed,
      icon: Globe,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Avg Duty Rate',
      value: `${analytics.avgDutyRate.toFixed(1)}%`,
      icon: Calculator,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Compliance Score',
      value: `${analytics.complianceScore.toFixed(0)}%`,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentOrders = orders.slice(-5);
  const dutyRatesByCountry = products.reduce((acc, product) => {
    const country = product.destination_country;
    const rate = parseFloat(product.duty_rate.replace('%', ''));
    if (acc[country]) {
      acc[country] = (acc[country] + rate) / 2;
    } else {
      acc[country] = rate;
    }
    return acc;
  }, {} as Record<string, number>);

  const complianceData = [
    {
      status: 'Compliant',
      count: documents.length,
      percentage: analytics.complianceScore,
      color: 'text-green-600',
      bgColor: 'bg-green-500',
    },
    {
      status: 'Pending',
      count: products.length - documents.length,
      percentage: 100 - analytics.complianceScore,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Monitor your export compliance and business metrics</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Duty Rates Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Duty Rates by Country</h3>
            <div className="space-y-4">
              {Object.entries(dutyRatesByCountry).map(([country, rate]) => (
                <div key={country} className="flex items-center justify-between">
                  <span className="text-gray-700">{country}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${(rate / 30) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12">{rate.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Compliance Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Compliance Overview</h3>
            <div className="space-y-4">
              {complianceData.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.bgColor}`} />
                    <span className="text-gray-700">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-gray-900">{item.count}</span>
                    <span className="text-sm text-gray-500">({item.percentage.toFixed(0)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm mb-8"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="p-6">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{order.product.product_name}</div>
                      <div className="text-sm text-gray-500">to {order.product.destination_country}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">${order.total_amount.toFixed(2)}</div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'processing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Link
            to="/product"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add New Product</h3>
                  <p className="text-gray-600">Classify and add products to catalog</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </div>
          </Link>

          <Link
            to="/documents"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Generate Documents</h3>
                  <p className="text-gray-600">Create export documentation</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;