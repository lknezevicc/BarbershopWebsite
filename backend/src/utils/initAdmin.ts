import User from '../models/user';

const initDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@barbershop.com';
    const adminPassword = 'admin123';
    const adminPhone= '+385955813567';

    const existingAdmin = await User.findOne({ email: adminEmail, role: 'admin' });
    
    if (!existingAdmin) {
      const admin = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        phone: adminPhone,
        password: adminPassword,
        role: 'admin'
      });

      await admin.save();
      console.log('Default admin created');
    } else {
      console.log('Default admin already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

export default initDefaultAdmin;