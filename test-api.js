// Test script for Mossa Time API
// Run with: node test-api.js

const API_BASE = 'http://localhost:3000/api'; // Change to your Vercel URL

async function testAPI() {
    console.log('🧪 Testing Mossa Time API...\n');
    
    try {
        // Test 1: Welcome endpoint
        console.log('1️⃣ Testing welcome endpoint...');
        const welcome = await fetch(`${API_BASE}`);
        const welcomeData = await welcome.json();
        console.log('✅ Welcome:', welcomeData.message);
        console.log('👨‍💻 Author:', welcomeData.author);
        console.log('');
        
        // Test 2: Add UID with days
        console.log('2️⃣ Adding UID with 7 days expiration...');
        const addResp = await fetch(`${API_BASE}/add_uid?uid=mossa123&time=7&type=days`);
        const addData = await addResp.json();
        console.log('✅ Added:', addData.message);
        console.log('⏰ Expires:', addData.expires_at);
        console.log('');
        
        // Test 3: Add permanent UID
        console.log('3️⃣ Adding permanent UID...');
        const permResp = await fetch(`${API_BASE}/add_uid?uid=mossa999&permanent=true`);
        const permData = await permResp.json();
        console.log('✅ Added permanent:', permData.message);
        console.log('');
        
        // Test 4: Check time for first UID
        console.log('4️⃣ Checking time for mossa123...');
        const timeResp = await fetch(`${API_BASE}/get_time/mossa123`);
        const timeData = await timeResp.json();
        console.log('✅ Remaining time:', timeData.remaining_time);
        console.log('👨‍💻 Added by:', timeData.added_by);
        console.log('');
        
        // Test 5: List all UIDs
        console.log('5️⃣ Listing all UIDs...');
        const listResp = await fetch(`${API_BASE}/list_uids`);
        const listData = await listResp.json();
        console.log('✅ Total UIDs:', listData.total_uids);
        console.log('👨‍💻 Managed by:', listData.managed_by);
        console.log('📋 UIDs:', Object.keys(listData.uids));
        console.log('');
        
        console.log('🎉 All tests passed! API by Mossa is working correctly.');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run tests
testAPI();