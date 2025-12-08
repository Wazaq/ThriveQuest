import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	await prisma.quest.createMany({
		data: [
			{
				title: 'Tidy your workspace for 10 minutes',
				description: 'A clean space helps create a clear mind.',
				domain: 'Accomplishment'
			},
			{
				title: 'Complete one task you have been avoiding',
				description: "Build momentum by tackling something you've procrastinated on.",
				domain: 'Accomplishment'
			},
			{
				title: 'Plan your top 3 priorities for tomorrow',
				description: 'Set yourself up for a successful day ahead.',
				domain: 'Accomplishment'
			},
			{
				title: 'Do 15 minutes of focused work without distractions',
				description: 'Turn off notifications and focus deeply on a single task.',
				domain: 'Accomplishment'
			},
			{
				title: 'Review your week and note one accomplishment',
				description: 'Recognize the progress you have already made.',
				domain: 'Accomplishment'
			}
		]
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
