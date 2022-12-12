
export const data = [
    {
        id: '0001',
        description: 'Bundle 100 kW',
        placeId: '0002',
        power: 100,
        price: 120,
        priority: 0,
    },
    {
        id: '0002',
        description: 'Bundle 50 kW',
        placeId: '0002',
        power: 50,
        price: 65,
        priority: 0,
    },
    {
        id: '0003',
        description: 'Bundle 100 kW',
        placeId: '0001',
        power: 100,
        price: 110,
        priority: 0,
    },
    {
        id: '0004',
        description: 'Bundle 100 kW Priority',
        placeId: '0001',
        power: 100,
        price: 140,
        priority: 1,
    },
    {
        id: '0005',
        description: 'Bundle 100 kW Luxury',
        placeId: '0002',
        power: 100,
        price: 150,
        priority: 2,
    },
    {
        id: '0006',
        description: 'Bundle 50 kW Priority',
        placeId: '0001',
        power: 50,
        price: 70,
    },
    {
        id: '0007',
        description: 'Bundle 50 kW Luxury',
        placeId: '0001',
        power: 50,
        price: 90,
    },
    {
        id: '0008',
        description: 'Bundle 200 kW',
        placeId: '0002',
        power: 200,
        price: 220,
    },
];

export const getAll = async () => {
    return data;
}

export const getById = async id => data.find(item => item.id === id);
