<template>
<el-dialog
	title="沟通"
	class="mini"
	:visible.sync="dialogVisible"
	width="830px"
	top="10vw"
	:append-to-body="true"
	:close-on-click-modal="false">
	<div style="height: 600px;" class="flex-column" ref="wrap" v-loading="loading">
		<el-scrollbar style="flex: 1;" ref="scrollBar">
			<div v-for="(obj, index) in chatMessage" class="clearfix">
				<div class="time" :style="index == 0 ? 'padding-top: 0' : ''">{{obj.add_time}}</div>
				<div class="message" :class="obj.sign != 1 ? 'fl row' : 'fr reverse'">
					<div style="flex-shrink: 0;">
						<div class="name" v-if="obj.sign != 1" style="text-align: center; color: #999;">{{obj.nickname}}</div>
						<img :src="obj.head_image || face" style="height: 46px; width: 46px;">
					</div>
					<div class="flex-column">
						<div class="content">
							<div class="triangle">
								<span class="icon-triangle"></span>
							</div>
							<span>{{obj.remark}}</span>
						</div>
					</div>
				</div>
			</div>
		</el-scrollbar>
		<div class="inputBox">
			<textarea class="fl remark" v-model="remark"></textarea>
			<input type="button" class="erp-btn small blue fr" value="发送" v-debounce="submit">
		</div>
	</div>
</el-dialog>
</template>

<script type="text/javascript">
import { postChatMessage, getChatMessage } from './api';
import { getNowFormatDate } from '@/utils/getDate';
import face from '@/assets/images/face.png'
export default {
	data () {
		return {
			remark: '',
			dialogVisible: false,
			loading: false,
			parentId: '',
			chatMessage: [],
			face
		}
	},
	methods: {
		setDialogVisible (visible, parentId) {
			this.loading = true;
			this.parentId = parentId;
			this.dialogVisible = visible;
			this.chatMessage = [];
			this.getChatMessage().then( _ => {
				this.loading = false;
			})
		},
		getChatMessage (sendData = {}) {
			return new Promise( (resolve, reject) => {
				getChatMessage(Object.assign({
					data: {
						id: this.parentId
					}
				}, sendData)).then( res => {
					this.chatMessage = [...res.data];
					this.$nextTick().then( _ => {
						this.$refs.scrollBar.wrap.scrollTop = this.$refs.scrollBar.wrap.scrollHeight;
					})
					resolve(res);
				})
			});
		},
		submit () {
			return new Promise( (resolve, reject) => {
				if (!this.remark){
					this.$message.error('发送的内容不能为空！');
					reject();
				} else {
					postChatMessage({
						data: {
							id: this.parentId,
							remark: this.remark
						}
					}).then( ({code}) => {
						if (code == 200) {
							this.chatMessage.push({
								add_time: getNowFormatDate({format: 'YYYYMMDD hhmmss'}),
								remark: this.remark,
								nickname: '',
								head_image: '',
								sign: 1
							})
							this.remark = '';
							this.$nextTick().then( _ => {
								this.$refs.scrollBar.wrap.scrollTop = this.$refs.scrollBar.wrap.scrollHeight;
							});

						}
						resolve();
					}).catch( _ => {
						reject();
					})
				}
			})
		},
		initData () {

		},

	},
	computed: {
	}
}
</script>

<style type="text/css" lang="scss" scoped="">
/deep/ .el-dialog .el-dialog__body{
	padding: 10px 0 0 0;
}
/deep/ .el-scrollbar__wrap{
	overflow-x: hidden;
	padding: 0 10px;
}
.time{
	text-align: center;
	color: #bbb;
	padding: 20px 0 10px 0;
}
.message{
	display: flex;
	align-items: center;
	&.reverse{
		flex-direction: row-reverse;
		.content {
			margin-right: 10px;
			margin-left: 20px;
			.icon-triangle{
				right: -12px;
				border-left-color: $blue; 
			}
		}
	}
	&.row{
		.content {
			margin-right: 20px;
			margin-left: 10px;
			.icon-triangle{
				left: -12px;
				border-right-color: $blue; 
			};
		}

	}
	.content{
		margin-top: 5px;
		background: $blue;
		border-radius: 10px;
		padding: 6px 15px;
		color: #fff;
		line-height: 24px;
		position: relative;
		.triangle{
			position: absolute;
			right: 0;
			left: 0;
			top: 0;
			bottom: 0;
			display: flex;
			align-items: center;
		}
		.icon-triangle{
			position: absolute;
			border: 6px solid transparent;
		}
	}
}
.inputBox{
	flex-shrink: 0;
	padding-top: 10px;
	margin-top: 5px;
	box-shadow: 0 0 5px #ccc;
	@include clearfix;
	.remark{
		width: calc(100% - 30px);
		min-height: 70px;
		max-height: 70px;
		padding:5px 10px;
		line-height: 16px;
		box-sizing: border-box;
		border-radius: 5px;
		border-color: #ddd;
		margin:0 15px;
	}
	.erp-btn{
		margin: 8px 15px 8px 0;
	}
}
</style>
