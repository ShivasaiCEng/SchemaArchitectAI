import { FieldType, RelationType } from './types.js';

export const TABLE_WIDTH = 240;
export const HEADER_HEIGHT = 40;
export const FIELD_HEIGHT = 32;

export const FIELD_TYPES = Object.values(FieldType);
export const RELATION_TYPES = Object.values(RelationType);

export const SAMPLE_SCHEMA_TABLES = [
  {
    id: 'users',
    name: 'User',
    x: 100,
    y: 100,
    fields: [
      { id: 'u1', name: 'email', type: FieldType.STRING, required: true, unique: true },
      { id: 'u2', name: 'password', type: FieldType.STRING, required: true, unique: false },
      { id: 'u3', name: 'role', type: FieldType.STRING, required: true, unique: false, defaultValue: 'user' },
    ]
  },
  {
    id: 'posts',
    name: 'Post',
    x: 500,
    y: 150,
    fields: [
      { id: 'p1', name: 'title', type: FieldType.STRING, required: true, unique: false },
      { id: 'p2', name: 'content', type: FieldType.STRING, required: true, unique: false },
      { id: 'p3', name: 'published', type: FieldType.BOOLEAN, required: false, unique: false, defaultValue: 'false' },
    ]
  }
];

export const SAMPLE_SCHEMA_RELATIONS = [
  {
    id: 'r1',
    sourceTableId: 'users',
    targetTableId: 'posts',
    type: RelationType.ONE_TO_MANY
  }
];

export const EXAMPLE_PRESETS = {
  'E-commerce Store (MongoDB)': {
    tables: [
      {
        id: 'u1', name: 'User', x: 50, y: 50, fields: [
          { id: 'f1', name: 'email', type: FieldType.STRING, required: true, unique: true },
          { id: 'f2', name: 'password', type: FieldType.STRING, required: true, unique: false },
          { id: 'f3', name: 'address', type: FieldType.OBJECT, required: false, unique: false },
        ]
      },
      {
        id: 'p1', name: 'Product', x: 400, y: 50, fields: [
          { id: 'f4', name: 'name', type: FieldType.STRING, required: true, unique: false },
          { id: 'f5', name: 'price', type: FieldType.NUMBER, required: true, unique: false },
          { id: 'f6', name: 'stock', type: FieldType.NUMBER, required: true, unique: false, defaultValue: '0' },
        ]
      },
      {
        id: 'o1', name: 'Order', x: 50, y: 400, fields: [
          { id: 'f7', name: 'totalAmount', type: FieldType.NUMBER, required: true, unique: false },
          { id: 'f8', name: 'status', type: FieldType.STRING, required: true, unique: false, defaultValue: 'pending' },
          { id: 'f9', name: 'createdAt', type: FieldType.DATE, required: true, unique: false },
        ]
      },
      {
        id: 'oi1', name: 'OrderItem', x: 400, y: 400, fields: [
          { id: 'f10', name: 'quantity', type: FieldType.NUMBER, required: true, unique: false },
          { id: 'f11', name: 'priceAtPurchase', type: FieldType.NUMBER, required: true, unique: false },
        ]
      }
    ],
    relations: [
      { id: 'r1', sourceTableId: 'u1', targetTableId: 'o1', type: RelationType.ONE_TO_MANY },
      { id: 'r2', sourceTableId: 'o1', targetTableId: 'oi1', type: RelationType.ONE_TO_MANY },
      { id: 'r3', sourceTableId: 'p1', targetTableId: 'oi1', type: RelationType.ONE_TO_MANY },
    ]
  },
  'Project Management (MongoDB)': {
    tables: [
      {
        id: 'proj1', name: 'Project', x: 50, y: 50, fields: [
          { id: 'pf1', name: 'name', type: FieldType.STRING, required: true, unique: true },
          { id: 'pf2', name: 'description', type: FieldType.STRING, required: false, unique: false },
          { id: 'pf3', name: 'deadline', type: FieldType.DATE, required: true, unique: false },
        ]
      },
      {
        id: 'task1', name: 'Task', x: 400, y: 150, fields: [
          { id: 'tf1', name: 'title', type: FieldType.STRING, required: true, unique: false },
          { id: 'tf2', name: 'status', type: FieldType.STRING, required: true, unique: false, defaultValue: 'todo' },
          { id: 'tf3', name: 'priority', type: FieldType.NUMBER, required: true, unique: false, defaultValue: '1' },
        ]
      },
      {
        id: 'user1', name: 'TeamMember', x: 50, y: 350, fields: [
          { id: 'uf1', name: 'name', type: FieldType.STRING, required: true, unique: false },
          { id: 'uf2', name: 'role', type: FieldType.STRING, required: true, unique: false },
        ]
      }
    ],
    relations: [
      { id: 'pr1', sourceTableId: 'proj1', targetTableId: 'task1', type: RelationType.ONE_TO_MANY },
      { id: 'pr2', sourceTableId: 'user1', targetTableId: 'task1', type: RelationType.ONE_TO_MANY },
      { id: 'pr3', sourceTableId: 'user1', targetTableId: 'proj1', type: RelationType.MANY_TO_MANY },
    ]
  },
  'Social Media (MongoDB)': {
    tables: [
       { id: 'u', name: 'User', x: 300, y: 50, fields: [{ id: '1', name: 'username', type: FieldType.STRING, required: true, unique: true }] },
       { id: 'p', name: 'Post', x: 50, y: 250, fields: [{ id: '2', name: 'caption', type: FieldType.STRING, required: false, unique: false }, { id: '3', name: 'imageUrl', type: FieldType.STRING, required: true, unique: false }] },
       { id: 'c', name: 'Comment', x: 550, y: 250, fields: [{ id: '4', name: 'text', type: FieldType.STRING, required: true, unique: false }] },
       { id: 'l', name: 'Like', x: 300, y: 450, fields: [{ id: '5', name: 'createdAt', type: FieldType.DATE, required: true, unique: false }] },
    ],
    relations: [
      { id: 'rel1', sourceTableId: 'u', targetTableId: 'p', type: RelationType.ONE_TO_MANY },
      { id: 'rel2', sourceTableId: 'u', targetTableId: 'c', type: RelationType.ONE_TO_MANY },
      { id: 'rel3', sourceTableId: 'p', targetTableId: 'c', type: RelationType.ONE_TO_MANY },
      { id: 'rel4', sourceTableId: 'u', targetTableId: 'l', type: RelationType.ONE_TO_MANY },
      { id: 'rel5', sourceTableId: 'p', targetTableId: 'l', type: RelationType.ONE_TO_MANY },
    ]
  },
  'Inventory System (PostgreSQL)': {
    tables: [
      {
        id: 'inv1', name: 'Product', x: 50, y: 50, fields: [
          { id: 'if1', name: 'sku', type: FieldType.STRING, required: true, unique: true },
          { id: 'if2', name: 'name', type: FieldType.STRING, required: true, unique: false },
          { id: 'if3', name: 'price', type: FieldType.NUMBER, required: true, unique: false },
        ]
      },
      {
        id: 'inv2', name: 'Warehouse', x: 450, y: 50, fields: [
          { id: 'if4', name: 'code', type: FieldType.STRING, required: true, unique: true },
          { id: 'if5', name: 'location', type: FieldType.STRING, required: true, unique: false },
        ]
      },
      {
        id: 'inv3', name: 'Supplier', x: 50, y: 350, fields: [
          { id: 'if6', name: 'companyName', type: FieldType.STRING, required: true, unique: true },
          { id: 'if7', name: 'contactEmail', type: FieldType.STRING, required: true, unique: false },
        ]
      },
      {
        id: 'inv4', name: 'StockLevel', x: 450, y: 350, fields: [
          { id: 'if8', name: 'quantity', type: FieldType.NUMBER, required: true, unique: false, defaultValue: '0' },
          { id: 'if9', name: 'lastUpdated', type: FieldType.DATE, required: true, unique: false },
        ]
      }
    ],
    relations: [
      { id: 'ir1', sourceTableId: 'inv3', targetTableId: 'inv1', type: RelationType.ONE_TO_MANY },
      { id: 'ir2', sourceTableId: 'inv1', targetTableId: 'inv4', type: RelationType.ONE_TO_MANY },
      { id: 'ir3', sourceTableId: 'inv2', targetTableId: 'inv4', type: RelationType.ONE_TO_MANY },
    ]
  },
  'SaaS Platform (MySQL)': {
    tables: [
      {
        id: 'st1', name: 'Tenant', x: 300, y: 50, fields: [
          { id: 'sf1', name: 'subdomain', type: FieldType.STRING, required: true, unique: true },
          { id: 'sf2', name: 'plan', type: FieldType.STRING, required: true, unique: false },
        ]
      },
      {
        id: 'st2', name: 'User', x: 300, y: 250, fields: [
          { id: 'sf3', name: 'email', type: FieldType.STRING, required: true, unique: true },
          { id: 'sf4', name: 'password_hash', type: FieldType.STRING, required: true, unique: false },
        ]
      },
      {
        id: 'st3', name: 'Role', x: 50, y: 250, fields: [
          { id: 'sf5', name: 'name', type: FieldType.STRING, required: true, unique: true },
          { id: 'sf6', name: 'permissions', type: FieldType.STRING, required: false, unique: false },
        ]
      },
      {
        id: 'st4', name: 'AuditLog', x: 550, y: 250, fields: [
          { id: 'sf7', name: 'action', type: FieldType.STRING, required: true, unique: false },
          { id: 'sf8', name: 'timestamp', type: FieldType.DATE, required: true, unique: false },
          { id: 'sf9', name: 'ip_address', type: FieldType.STRING, required: true, unique: false },
        ]
      },
      {
        id: 'st5', name: 'Subscription', x: 300, y: 450, fields: [
          { id: 'sf10', name: 'status', type: FieldType.STRING, required: true, unique: false },
          { id: 'sf11', name: 'renewDate', type: FieldType.DATE, required: true, unique: false },
        ]
      }
    ],
    relations: [
      { id: 'sr1', sourceTableId: 'st1', targetTableId: 'st2', type: RelationType.ONE_TO_MANY },
      { id: 'sr2', sourceTableId: 'st1', targetTableId: 'st4', type: RelationType.ONE_TO_MANY },
      { id: 'sr3', sourceTableId: 'st1', targetTableId: 'st5', type: RelationType.ONE_TO_ONE },
      { id: 'sr4', sourceTableId: 'st2', targetTableId: 'st4', type: RelationType.ONE_TO_MANY },
      { id: 'sr5', sourceTableId: 'st2', targetTableId: 'st3', type: RelationType.MANY_TO_MANY },
    ]
  },
  'University System (SQL)': {
    tables: [
      {
        id: 'uni1', name: 'Department', x: 500, y: 50, fields: [
          { id: 'uni_f1', name: 'deptCode', type: FieldType.STRING, required: true, unique: true },
          { id: 'uni_f2', name: 'name', type: FieldType.STRING, required: true, unique: false },
        ]
      },
      {
        id: 'uni2', name: 'Professor', x: 275, y: 50, fields: [
          { id: 'uni_f3', name: 'staffId', type: FieldType.STRING, required: true, unique: true },
          { id: 'uni_f4', name: 'fullName', type: FieldType.STRING, required: true, unique: false },
        ]
      },
      {
        id: 'uni3', name: 'Student', x: 50, y: 300, fields: [
          { id: 'uni_f5', name: 'studentId', type: FieldType.STRING, required: true, unique: true },
          { id: 'uni_f6', name: 'fullName', type: FieldType.STRING, required: true, unique: false },
          { id: 'uni_f7', name: 'enrollmentDate', type: FieldType.DATE, required: true, unique: false },
        ]
      },
      {
        id: 'uni4', name: 'Course', x: 500, y: 300, fields: [
          { id: 'uni_f8', name: 'courseCode', type: FieldType.STRING, required: true, unique: true },
          { id: 'uni_f9', name: 'credits', type: FieldType.NUMBER, required: true, unique: false },
        ]
      }
    ],
    relations: [
      { id: 'urel1', sourceTableId: 'uni1', targetTableId: 'uni4', type: RelationType.ONE_TO_MANY },
      { id: 'urel2', sourceTableId: 'uni1', targetTableId: 'uni2', type: RelationType.ONE_TO_MANY },
      { id: 'urel3', sourceTableId: 'uni2', targetTableId: 'uni4', type: RelationType.ONE_TO_MANY },
      { id: 'urel4', sourceTableId: 'uni3', targetTableId: 'uni4', type: RelationType.MANY_TO_MANY },
    ]
  }
};

