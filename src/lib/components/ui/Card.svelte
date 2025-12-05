<script lang="ts">
	interface Props {
		padding?: 'sm' | 'md' | 'lg';
		children?: any;
	}

	let { padding = 'md', children }: Props = $props();

	const paddingClasses = {
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8'
	};
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 {paddingClasses[padding]}">
	{@render children?.()}
</div>
