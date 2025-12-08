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

<div
	class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 {paddingClasses[
		padding
	]}"
>
	{@render children?.()}
</div>
