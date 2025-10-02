import { connectMongo } from './utils/mongo.js';
import { UserModel } from './models/user.model.js';
import { LocationModel } from './models/location.model.js';
import { EquipmentModel } from './models/equipment.model.js';
import bcrypt from 'bcryptjs';
import { env } from './utils/env.js';

async function main() {
  await connectMongo();

  const salt = await bcrypt.genSalt(Number(env.BCRYPT_SALT_ROUNDS || 10));
  const adminPass = await bcrypt.hash('Admin123!', salt);
  const userPass = await bcrypt.hash('User123!', salt);

  const admin = await UserModel.findOneAndUpdate(
    { email: 'admin@formotex.local' },
    { email: 'admin@formotex.local', fullName: 'FORMOTEX Admin', role: 'ADMIN', passwordHash: adminPass },
    { upsert: true, new: true }
  );

  const user = await UserModel.findOneAndUpdate(
    { email: 'user@formotex.local' },
    { email: 'user@formotex.local', fullName: 'Regular User', role: 'USER', passwordHash: userPass },
    { upsert: true, new: true }
  );

  const hq = await LocationModel.findOneAndUpdate(
    { code: 'HQ-01' },
    { code: 'HQ-01', name: 'Headquarters' },
    { upsert: true, new: true }
  );

  await EquipmentModel.create([
    { assetTag: 'PC-0001', serialNumber: 'SN-A-001', brand: 'Dell', model: 'OptiPlex 7010', category: 'Desktop', locationId: hq._id },
    { assetTag: 'NB-0001', serialNumber: 'SN-B-001', brand: 'Lenovo', model: 'ThinkPad T14', category: 'Laptop', locationId: hq._id },
    { assetTag: 'MN-0001', serialNumber: 'SN-C-001', brand: 'HP', model: 'Z24n', category: 'Monitor', locationId: hq._id },
  ]).catch(() => {});

  console.log({ admin: admin.email, user: user.email, location: hq.code });
  process.exit(0);
}

main();
