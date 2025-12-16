import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Enregistrer les composants nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const RevenueChart = ({ orders = [] }) => {
  // Préparer les données pour le graphique de revenus
  const monthlyRevenue = Array(12).fill(0);
  
  orders.forEach(order => {
    if (order.isPaid) {
      const month = new Date(order.paidAt).getMonth();
      monthlyRevenue[month] += order.totalPrice;
    }
  });

  const data = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Revenu mensuel (€)',
        data: monthlyRevenue,
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `$${value}`
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export const SalesByCategoryChart = ({ products = [], orders = [] }) => {
  const productsArray = Array.isArray(products) ? products : (products.products || []);
  
  console.log('Products in chart:', products);
  console.log('Orders in chart:', orders);
  console.log('Sample order items:', orders[0]?.items);
  
  // Créer un index des produits par nom pour une recherche plus rapide
  const productByName = {};
  productsArray.forEach(product => {
    if (product && product.name) {
      productByName[product.name] = product;
    }
  });

  // Calculer les ventes par catégorie
  const categorySales = {};
  
  orders.forEach(order => {
    if (order.isPaid && order.items) {
      order.items.forEach(item => {
        // Si l'item a un nom de produit, on l'utilise pour trouver la catégorie
        if (item.name && productByName[item.name]) {
          const category = productByName[item.name].category;
          console.log('item.name :', item.name);
          console.log('category names :', category);
          if (category) {
            categorySales[category] = (categorySales[category] || 0) + (item.quantity || 1);
          }
        }
      });
    }
  });

  console.log('Product names in catalog:', Object.keys(productByName));
  console.log('Order item names:', orders.flatMap(order => 
    order.items?.map(item => item.name) || []
  ));
  console.log('Category sales:', categorySales);

  // Si aucune vente n'est trouvée
  if (Object.keys(categorySales).length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Aucune donnée de vente par catégorie disponible
      </div>
    );
  }

  const data = {
    labels: Object.keys(categorySales),
    datasets: [
      {
        data: Object.values(categorySales),
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Ventes par catégorie',
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};