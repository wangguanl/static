<el-dialog
	title="标题"
	width="830px"
	top="3vw"
	:before-close="handleClose"
	:visible.sync="dialogVisible"
	:append-to-body="true"
	:close-on-click-modal="false"
	:destroy-on-close="true">

	<div class="footer-btn">
		<input type="button" class="btn cancel" value="取消" @click="handleClose">
		<input type="button" class="btn submit" value="确定" @click="submit">
	</div>
	
</el-dialog>

<script type="text/javascript">
import mixin from '@/mixin/dialog';
export default {
	mixins: [mixin],
	data () {
		return {
			dialogVisible: false,
		}
	},
	methods: {
		createProduct () {
			this.createProductDialogName = 'createProduct';
			createProduct().then(_ => {
				this.$nextTick().then(_ => {
					this.$refs.createProduct.openDialog();
				})
			})
		},
		initDialog () {

		},
	}
}
</script>

<style type="text/css" lang="scss" scoped="">
@import '@/mixin/dialog.scss';
</style>